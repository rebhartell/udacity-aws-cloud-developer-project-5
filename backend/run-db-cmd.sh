#!/bin/bash

echo

if [ "${1}" == "" ]; then
  echo "Usage: ${0} db/<command>.js"
  echo
  echo $( ls db/*.js )
else
  npx ts-node ${1}
fi

echo