#!/bin/bash
dir_name=$(pwd)
date_now=$(date +%Y%m%d-%H%M%S)
oss_project=$1
oss_bin_path=$2

echo "oss上传工具地址: ${oss_bin_path}"

# 最终到webpack的public_url
public_url="https://front.ejingling.cn/${oss_project}/${date_now}"
echo "public_url路径: ${public_url}"

"${dir_name}"/node_modules/.bin/cross-env PUBLIC_URL="${public_url}" npm run build

# 除html部署到cdn
cp -a "${dir_name}/dist" "${dir_name}/${date_now}"
${oss_bin_path} cp -r -f "${dir_name}/${date_now}/" "oss://egenie-frontend/${oss_project}/${date_now}/"
rm -rf "${dir_name:?}/${date_now}"

echo "上传cdn成功"
