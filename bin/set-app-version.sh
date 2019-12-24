#!/bin/sh

# git checkout -f

git_log_file='git-log.txt'

# 输出 git log 文件
git log --pretty=oneline > $git_log_file

PACKAGE_VERSION=`node -p "require('$PWD/package.json').version"`

echo "package version: $PACKAGE_VERSION"

outdir_CMD="--outdir"
outdir="$PWD/src"

if [[ $2 = $outdir_CMD ]]; then
  echo 'spec outdir 1'
  if [[ -n $3 ]]; then
    echo 'spec outdir 2'
    outdir="$PWD/$3"
  fi
fi

echo "output dir is: $outdir"

BASEDIR=$(dirname "$0")

if [[ ! -d $outdir ]]; then
  mkdir -p $outdir
fi

target_version="$outdir/version.json"
template_version_file="$BASEDIR/version-template.json"

# 新建版本文件
rm -f $target_version
cp -f $template_version_file $target_version

# 存储必要信息
DATE=$(date "+%Y-%m-%d+%H:%M:%S")
git_hash=`awk 'NR==1 {print $1}' $git_log_file`
num_ver=`awk 'END{print NR}' $git_log_file`

# 写入版本模版文件
sed -i -e "s#PACKAGE_VERSION#${PACKAGE_VERSION}#g" $target_version
sed -i -e "s#BUILD_VERSION#${num_ver}#g" $target_version
sed -i -e "s#VERSION#$PACKAGE_VERSION+$num_ver#g" $target_version
sed -i -e "s#BUILD_DATE#${DATE}#g" $target_version
sed -i -e "s#GIT_HASH#${git_hash}#g" $target_version

# 输出版本信息
echo "-------------------"
echo "package version: $PACKAGE_VERSION"
echo "build count version: $num_ver"
echo "git hash: $git_hash"
echo "-------------------"
echo "\033[34m[ Set version successed! ]\033[0m"

# 清理 log 文件
rm -f $git_log_file
