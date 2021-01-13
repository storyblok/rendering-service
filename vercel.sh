#!/bin/bash

if [[ $VERCEL_GIT_COMMIT_REF == "main"  ]] ; then 
  echo "main branch detected"
  npm run deploy
else 
  echo "Not main branch"
  npm run build
fi
