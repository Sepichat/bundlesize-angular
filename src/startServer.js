const fastify = require('fastify')();
const { getBundleSize } = require('./bundle-pack-builder/installPackage')

fastify.get('/bundle/packageSize', async (request, reply) => {
    const packageName = request.query.q;
    const bundleData = await getBundleSize(packageName);
    return reply.code(200).send(bundleData)
});

const start = async () => {
    try {
        await fastify.listen(3000)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start();