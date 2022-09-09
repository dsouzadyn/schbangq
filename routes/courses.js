const { PrismaClient } = require('@prisma/client');
var express = require('express');
var prisma = new PrismaClient();
var router = express.Router();
var authmiddleware = require('../middlewares/auth');


router.use(authmiddleware.authenticator);

router.get('/', async function(req, res, next) {
  try {
    const status = await prisma.status.findFirst({
      where: {
        name: "APPROVED"
      }
    });
    const courses = await prisma.course.findMany({
      where: {
        statusID: status.id
      },
      include: {
        Topic: true,
        Status: true,
        Category: true
      }
    });
    res.status(200).json({data: courses});
  } catch (e) {
    console.error(e);
    res.status(400).json({error: e});
  }
});

router.post('/create', async function(req, res, next) {
  if (["EMPLOYEE", "SUPER_ADMIN"].includes(req.user.roles.name)) {
    return res.status(401).json({"error": "not authorized to create courses"});
  }
  try {
    const status = await prisma.status.findFirst({
      where: {
        name: req.body.status
      }
    });
    const course = await prisma.course.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        videoURL: req.body.videoURL,
        Category: {
          connectOrCreate: req.body.categories.map((entity) => {
            return {
              where: {
                name: entity.name,
              },
              create: {
                name: entity.name
              }
            }
          })
        },
        Topic: {
          create: req.body.topics.map((topic) => {
            return {
              name: topic.name,
              description: topic.description,
              TopicType: {
                connectOrCreate: {
                  where: {
                    name: topic.type,
                  },
                  create: {
                    name: topic.type
                  }
                }
                
              }
            }
          })
        },
        Status: {
          connect: {
            id: status.id
          }
        },
        CreatedBy: {
          connect: {
            id: req.user.user_id
          }
        }
      },
      include: {
        Category: true,
        Topic: true,
        CreatedBy: {
          select: {
            name: true,
          }
        },
        Status: true
      }
    })
    res.status(201).json({"success": true, data: course});
  } catch (e) {
    console.error(e);
    res.status(400).json({error: e});
  }
})

router.put('/update/:courseId', async function (req, res, next) {
  if (["EMPLOYEE", "SUPER_ADMIN"].includes(req.user.roles.name)) {
    return res.status(401).json({"error": "not authorized to update courses"});
  }
  var courseID = +req.params.courseId;
  try {
    const status = await prisma.status.findFirst({
      where: {
        name: req.body.status
      }
    });
    const course = await prisma.course.update({
      where: {
        id: courseID
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        videoURL: req.body.videoURL,
        Status: {
          connect: {
            id: status.id
          }
        },
        CreatedBy: {
          connect: {
            id: req.user.user_id
          }
        }
      },
      include: {
        Category: true,
        Topic: true,
        CreatedBy: {
          select: {
            name: true,
          }
        },
        Status: true
      }
    })
    res.status(201).json({"success": true, data: course});
  } catch (e) {
    console.error(e);
    res.status(400).json({error: e});
  }
})

router.put("/approve/:courseId", async function (req, res, next) {
  const currentStatus = req.body.status;
  
  if (currentStatus == "APPROVED" && ["EMPLOYEE", "ADMIN"].includes(req.user.roles.name)) {
    return res.status(401).json({"error": "not authorized to approve courses"});
  } else if (currentStatus == "AWAITING_APPROVAL" && ["EMPLOYEE", "SUPER_ADMIN"].includes(req.user.roles.name)) {
    return res.status(401).json({"error": "not authorized to send for approval"});
  }

  var courseID = +req.params.courseId;
  try {
    const status = await prisma.status.findFirst({
      where: {
        name: req.body.status
      }
    });
    const course = await prisma.course.update({
      where: {
        id: courseID
      },
      data: {
        statusID: status.id
      }
    });
    res.status(201).json({"success": true});
  } catch (e) {
    console.error(e);
    res.status(400).json({error: e});
  }

})

module.exports = router;
