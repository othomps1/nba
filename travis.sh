set -e
set -x

make test
make coverage
cat ./coverage/lcov.info | ./node_modules/.bin/coveralls

