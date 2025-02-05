const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: {type:String, required: true},
  gender: { type: String, required: true },
  address: { type: String, required: true },
  subjects: {type: String, required: true},
  dateofbirth: { type: Date, required: true },
  qualification:{type:String, required: true},
  specialization: {type:String, required: true},
  experience: {type:String, required: true},
  idCard: { type: String, required: true },
  photo: { type: String, required: true },
  degreeCertificate: { type: String, required: true },
  experienceCertificate: { type: String, required: true },
  resume: { type: String, required: true },
  subjects: {type : String, required: true},
  active: {type:Boolean, default:false},
  subjectassigned: {type:String, required:false},

  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model("Teacher", teacherSchema);
