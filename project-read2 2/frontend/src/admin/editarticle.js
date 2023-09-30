import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { Rss } from "react-bootstrap-icons";
import "../styles/editall.css";
import { useHistory } from "react-router-dom";

function Editarticle() {
  const history = useHistory();

  const cancelEditBook = () => {
    history.goBack();
  };

  return (
    <div>
      <Header />

      <section>
        <h1>แก้ไขบท</h1>

        <div className="grid-containerE">
          <div className="fgE">
            <form className="form-group">
              <h2>กรุณากรอกรายละเอียดบทที่ต้องการแก้ไข</h2>
              <div className="mb-3">
                <label htmlFor="bookname">ชื่อหนังสือ</label>

                    <input
                    type="text"
                    className="form-control"
                    id="bookname"
                    />
                </div>

                <div className="mb-3">
                <label htmlFor="articlename">ชื่อบท</label>

                    <input
                    type="text"
                    className="form-control"
                    id="articlename"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="articledetail">เนื้อหา</label>
                    <input
                    type="text"
                    className="form-control"
                    id="articledetail"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="image">รูปในเนื้อหา</label>
                    <input
                    type="text"
                    className="form-control"
                    id="image"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="sounds">เสียง</label>
                    <input
                    type="text"
                    className="form-control"
                    id="sounds"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="vocabs">คำศัพท์</label>
                    <input
                    type="text"
                    className="form-control"
                    id="vocabs"
                    />
                </div>

                <div className="btn-containerr">
                    <div className="btn-group me-2">
                    <Button
                        type="submit"
                        className="btnE btn-warning"
                        onClick={cancelEditBook}
                    >
                        ยกเลิก
                    </Button>
                    </div>
                    <div className="btn-group me-2">
                    <Button
                        type="submit"
                        className="btnE btn-primary"
                        //onClick={addBook}
                    >
                        ยืนยัน
                    </Button>
                    </div>
                </div>
                </form>
            </div>
            </div>
        </section>
    </div>
  );
}

export default Editarticle;
