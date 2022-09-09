const { PrismaClient } = require("@prisma/client");
var express = require("express");
var prisma = new PrismaClient();
var router = express.Router();
var authmiddleware = require("../middlewares/auth");

router.use(authmiddleware.authenticator);

router.post("/create/:courseId", async function (req, res, next) {
  var courseID = +req.params.courseId;
  try {
    const topic = await prisma.topic.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        Course: {
          connect: {
            id: courseID
          }
        },
        TopicType: {
          connectOrCreate: {
            where: {
              name: req.body.type,
            },
            create: {
              name: req.body.type,
            },
          },
        },
      },
      include: {
        TopicType: true,
      }
    })
    return res.status(201).json({success: true, data: topic});
  } catch (e) {
    console.error(e);
    return res.status(400).json({error: e});
  }
});

router.put("/update/:courseId/:topicId", async function (req, res, next) {
  var courseID = +req.params.courseId;
  var topicId = +req.params.topicId;
  try {
    const topic = await prisma.topic.update({
      where: {
        id: topicId,
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        courseID: courseID,
        topicTypeId: req.body.topicTypeId,
      },
    });
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e });
  }
});

router.delete("/delete/:courseId/:topicId", async function (req, res, next) {
  var courseID = +req.params.courseId;
  var topicId = +req.params.topicId;
  try {
    const deletedTopics = await prisma.topic.delete({
      where: {
        id: topicId,
      },
    });
    return res.status(200).json({success: true});
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e });
  }
});

module.exports = router;