const {
  createResource,
  getResources,
  updateResource,
  deleteResource,
} = require("../repositories/resource.repository");

async function create(req, res, next) {
  try {
    const { title, description } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const resource = await createResource({
      title: title.trim(),
      description: description?.trim() || null,
      createdBy: Number(req.user.id),
    });

    return res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    next(error);
  }
}

async function getAll(req, res, next) {
  try {
    const resources = await getResources();

    return res.status(200).json({
      resources,
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body || {};

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid resource ID",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const resource = await updateResource(id, {
      title: title.trim(),
      description: description?.trim() || null,
    });

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid resource ID",
      });
    }

    const resource = await deleteResource(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      message: "Resource deleted successfully",
      resource,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  getAll,
  update,
  remove,
};