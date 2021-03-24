FROM public.ecr.aws/lambda/nodejs:12

COPY index.js package*.json ${LAMBDA_TASK_ROOT}/
COPY dist/package ${LAMBDA_TASK_ROOT}/dist/package

RUN cd ${LAMBDA_TASK_ROOT} && yum -y install pkgconfig libX11 libXext && npm ci --only=production

CMD [ "index.handler" ]