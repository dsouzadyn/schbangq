const { PrismaClient } = require('@prisma/client')
const { permissions, rolepermissions, roles, statuses } = require('./data.js')
const prisma = new PrismaClient()


const load = async() => {
    try {
        await prisma.rolePermissions.deleteMany();
        console.log('Deleted records in the rolePermissions table');

        await prisma.permission.deleteMany();
        console.log('Deleted records in the permissions table');
        
        await prisma.role.deleteMany();
        console.log('Deleted records in the roles table');

        await prisma.status.deleteMany();
        console.log('Deleted records in the statuses table');

        await prisma.$queryRaw`UPDATE sqlite_sequence SET  seq = 1 WHERE name= 'Permission'`;
        console.log('Reset permission auto increment to 1');

        await prisma.$queryRaw`UPDATE sqlite_sequence SET  seq = 1 WHERE name= 'Role'`;
        console.log('Reset role auto increment to 1');
        for(var i = 0; i < permissions.length; i++) {
            await prisma.permission.create({
                data: permissions[i]
            });
        }
        console.log('added permission data');

        for(var i = 0; i < roles.length; i++) {
            await prisma.role.create({
                data: roles[i]
            });
        };
        console.log('added role data');

        for(var i = 0; i < rolepermissions.length; i++) {
            await prisma.rolePermissions.create({
                data: rolepermissions[i]
            });
        };
        console.log('mapped roles to permissions');

        for(var i = 0; i < statuses.length; i++) {
            await prisma.status.create({
                data: statuses[i]
            });
        }
        console.log('added status data');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}


load();