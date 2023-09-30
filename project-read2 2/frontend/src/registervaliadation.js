function registervalidation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.name === "") {
        error.name = "กรุณากรอกชื่อ"
    }
    else {
        error.name = ""
    }

    if(values.surname === "") {
        error.surname = "กรุณากรอกนามสกุล"
    }
    else {
        error.surname = ""
    }

    if(values.email === "") {
        error.email = "กรุณากรอกอีเมลล์"
    }
    else {
        error.email = ""
    }

    if(values.password === "") {
        error.password = "กรุณากรอกรหัสผ่าน"
    }
    else {
        error.password = ""
    }

    if(values.usertype === "") {
        error.usertype = "กรุณาเลือกประเภทผู้ใช้งาน"
    }
    else {
        error.usertype = ""
    }

    return error;

}

export default registervalidation;