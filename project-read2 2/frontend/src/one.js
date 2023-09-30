import './styles/one.css';
// import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';

function One() {

    return (
        
        <section className="hero">
                    <div className="onecontent">
                        <div className="box">
                            <h1>ยินดีต้อนรับ</h1> 
                            <p>เข้าสู่เว็บสำหรับฝึกอ่านบทความภาษาไทย เพื่อเข้าใช้บริการกรุณาเข้าสู่ระบบ</p>
                            <Button className='buttonlog' href="./login" style={{color:"white"}}>เข้าสู่ระบบ</Button>
                        </div>
                    </div>
                    
        </section>
        
        );
    }
export default One;
