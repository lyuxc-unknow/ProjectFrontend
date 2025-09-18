export const addClassRules = {
  name: [
    { required: true, message: "请输入班级名称", trigger: "blur" },
    { min: 2, max: 50, message: "班级名称长度在2到50个字符", trigger: "blur" },
  ],
  headTeacher: [
    { required: true, message: "请输入班主任名称", trigger: "blur" },
    { min: 2, max: 10, message: "班主任名称长度在2到10个字符", trigger: "blur" },
  ]
};

export const addStudentRules = {
  studentId: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { min: 6, max: 20, message: "学号长度在6到20个字符", trigger: "blur" },
  ],
  name: [
    { required: true, message: "请输入学生姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur" },
  ],
};


