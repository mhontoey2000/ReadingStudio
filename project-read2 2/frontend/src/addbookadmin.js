import React from 'react';
import './addbookadmin.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";

function Addbookadmin() {
    return (
    <div className="home">

        <header className="home-header">
            <Header/>
        </header>

                <section >
                    <p className='hbook'>บทความ<button class="buttonadd"> เพิ่ม </button> </p>
                    
                    <div className='book'>
                        <div class="grid-container">
                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 1</text><br></br>
                            <img className='img' variant="top" src="../picture/1.jpg"/><br></br>
                            <text>ดวงอาทิตย์ อุปราคา ท้องฟ้ากลางคืน นก ปลา เครื่องจักรกล พลังงาน อากาศยาน และ ดนตรีไทย</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div>

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 2</text><br></br>
                            <img className='img' variant="top" src="../picture/2.jpg"/><br></br>
                            <text>การจำแนกและจัดลำดับหมวดหมู่ของสัตว์ เวลา บรรยากาศ การตรวจอากาศ อุตสาหกรรม อุปกรณ์ขยายขอบเขตของสัมผัส มหาราชในประวัติศาสตร์ไทย การศึกษา กรุงเทพมหานคร และ ตราไปรษณียากรไทย</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div>

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 3</text><br></br>
                            <img className='img' variant="top" src="../picture/3.jpg"/><br></br>
                            <text>ข้าว ข้าวโพด ฝ้าย ยางพารา ทรัพยากรป่าไม้ ผลิตผลป่าไม้ การทำไม้ วัชพืช วัว ควาย และ ช้าง</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div> 

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 4</text><br></br>
                            <img className='img' variant="top" src="../picture/4.jpg"/><br></br>
                            <text>การเรืองแสงของสิ่งมีชีวิต การหายใจ ความสมดุลของของเหลวในร่างกาย ไวรัส ปรากฏการณ์ของอากาศ ภูมิอากาศ รถไฟ การศาสนา การต่างประเทศสมัยรัตนโกสินทร์ และ ลำดับพระมหากษัตริย์ไทย</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div> 

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 5</text><br></br>
                            <img className='img' variant="top" src="../picture/5.jpg"/><br></br>
                            <text>ผัก ไม้ผล อ้อย มันสำปะหลัง พืชหัว การขยายพันธุ์พืช เป็ด ไก่ และ พันธุ์ไม้ป่า</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div>

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 6</text><br></br>
                            <img className='img' variant="top" src="../picture/6.jpg"/><br></br>
                            <text>คณิตศาสตร์เบื้องต้น ประวัติและพัฒนาการเกี่ยวกับจำนวน เซต ตรรกวิทยา ฟังก์ชัน สมการและอสมการ จุด เส้น และผิวโค้ง ระยะทาง พื้นที่ ปริมาตร สถิติ ความน่าจะเป็น เมตริก กราฟ และ คณิตศาสตร์ ธรรมชาติ และ ศิลปะ</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div> 

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 7</text><br></br>
                            <img className='img' variant="top" src="../picture/7.jpg"/><br></br>
                            <text>กล้วยไม้ ผีเสื้อในประเทศไทย การปลูกหม่อนเลี้ยงไหม โรคพืช ครั่ง การเลี้ยงปลา การชลประทาน บ้านเรือนของเรา และ โทรคมนาคม (ภาคแรก)</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div>

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 8</text><br></br>
                            <img className='img' variant="top" src="../picture/8.jpg"/><br></br>
                            <text>ประวัติการแพทย์และเภสัชกรรมไทย กายวิภาคศาสตร์และสรีรวิทยา การกำเนิดของโรค การบริบาลทารกและโรคทางกุมารเวชศาสตร์ ศัลยศาสตร์และวิสัญญีวิทยา เลือดและธนาคารเลือดในประเทศไทย และอุบัติเหตุและการปฐมพยาบาล</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div>

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 9</text><br></br>
                            <img className='img' variant="top" src="../picture/9.jpg"/><br></br>
                            <text>เรื่องของยา สูติศาสตร์และนรีเวชวิทยา วิธีการทางการแพทย์ในการควบคุมการเจริญพันธุ์ การทำแท้ง การสาธารณสุข โรคมะเร็ง รังสีวิทยา ฟันและเหงือกของเรา เวชศาสตร์ชันสูตร เวชศาสตร์ฟื้นฟู นิติเวชศาสตร์ โภชนาการ และ ยาเสพติดให้โทษและวัตถุออกฤทธิ์ต่อจิตประสาท</text><br></br>
                            <button className='button' variant="primary">อ่าน</button>
                        </div>

                        <div class="grid-item">
                            <text className='bookh'>เล่มที่ 10</text><br></br>
                            <img className='img' variant="top" src="../picture/10.jpg"/><br></br>
                            <text>โรคทางอายุรศาสตร์ โรคติดต่อและโรคเขตร้อน โรคภูมิแพ้ โรคผิวหนังที่พบบ่อยในประเทศไทย โรคตา โรคหู คอ จมูก จิตเวชศาสตร์และสุขภาพจิต สิ่งแวดล้อมและสุขภาพ การออกกำลังกายเพื่อสุขภาพ และ การปลูกกระดูกข้ามคน</text><br></br>
                            <utton className='button' variant="primary">อ่าน</utton>
                        </div>
                    </div>
                    </div>
                </section>
            </div>
        );
    }
export default Addbookadmin;
