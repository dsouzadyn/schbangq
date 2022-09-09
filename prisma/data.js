module.exports = {
    roles: [{
        id: 1,
        name: "EMPLOYEE",
    }, {
        id: 2,
        name: "ADMIN",
    }, {
        id: 3,
        name: "SUPER_ADMIN",
    }],
    permissions: [{
        id: 1,
        name: "VIEW_APPROVED",
        active: true,
    },{
        id: 2,
        name: "CREATE_COURSE",
        active: true,
    },{
        id: 3,
        name: "UPDATE_COURSE",
        active: true,
    },{
        id: 4,
        name: "DELETE_COURSE",
        active: true,
    },{
        id: 5,
        name: "APPROVE_COURSE",
        active: true,
    },{
        id: 6,
        name: "REJECT_COURSE",
        active: true,
    }],
    rolepermissions: [{
        roleId: 1,
        permissionId: 1,
    },{
        roleId: 2,
        permissionId: 2,
    },{
        roleId: 2,
        permissionId: 3,
    },{
        roleId: 2,
        permissionId: 4,
    },{
        roleId: 3,
        permissionId: 5,
    },{
        roleId: 3,
        permissionId: 6,
    }],
    statuses: [{
        id: 1,
        name: "APPROVED"
    }, {
        id: 2,
        name: "REJECTED"
    }, {
        id: 3,
        name: "DRAFT"
    }, {
        id: 4,
        name: "AWAITING_APPROVAL"
    }],
}