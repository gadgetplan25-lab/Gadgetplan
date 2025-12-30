const Technician = require("../models/technician");
const path = require("path");

exports.addTechnician = async (req, res) => {
  try {
    const { name } = req.body;
    let photoUrl = null;

    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const technician = await Technician.create({ name, photoUrl });
    res.status(201).json({ message: "Technician added", technician });
  } catch (error) {
    console.error("Error adding technician:", error);
    res.status(500).json({ message: "Failed to add technician" });
  }
};

exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.findAll();
    res.json(technicians);
  } catch (error) {
    console.error("Error fetching technicians:", error);
    res.status(500).json({ message: "Failed to fetch technicians" });
  }
};

exports.updateTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let photoUrl;

    // kalau ada file foto baru
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    // cari teknisi
    const technician = await Technician.findByPk(id);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    // update data
    technician.name = name || technician.name;
    if (photoUrl) technician.photoUrl = photoUrl;

    await technician.save();

    res.json({ message: "Technician updated successfully", technician });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controllers/technicianController.js
exports.deleteTechnician = async (req, res) => {
  try {
    const { id } = req.params;

    const technician = await Technician.findByPk(id);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    await technician.destroy();
    res.json({ message: "Technician deleted successfully" });
  } catch (error) {
    console.error("Error deleting technician:", error);
    res.status(500).json({ message: "Failed to delete technician" });
  }
};
