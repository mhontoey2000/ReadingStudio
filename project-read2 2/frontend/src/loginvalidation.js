function loginvalidation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.email === "") {
        error.email = "กรุณากรอกอีเมลล์"
    }
    else if(!email_pattern.test(values.email)){
        error.email = "อีเมลล์ผิด"
    } else {
        error.email = ""
    }

    if(values.password === "") {
        error.password = "กรุณากรอกรหัสผ่าน"
    }
    else if(!password_pattern.test(values.password)) {
        error.password = "รหัสผ่านผิด"
    } else {
        error.password = ""
    }
    return error;

}

export default loginvalidation;