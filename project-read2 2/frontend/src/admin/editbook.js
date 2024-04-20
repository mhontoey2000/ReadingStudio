import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import "../styles/editall.css";
import { useHistory } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

function Editbook() {
  const history = useHistory();
  const { bookid } = useParams();
  const [bname, setBname] = useState("");
  const [bdetail, setBdetail] = useState("");
  const [bookImage, setBookImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isLoadedBtn, setIsLoadedBtn] = useState(true); // close click btn for loadData....

  useEffect(() => {
    apiClient
      .get(`api/article`)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].article_id === bookid) {
            setBname(response.data[i].article_name);
            setBdetail(response.data[i].article_detail);
            setBookImage(response.data[i].article_imagedata);
            // console.log(response.data[i].article_name);
            break; // หากเจอหนังสือที่ตรงให้หยุดการวน loop
          }
        }
        // open click btn
        setIsLoadedBtn(false)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bookid]);

  const cancelEditBook = () => {
    history.replace("/Page/allbookadmin");
  };

  const updateBdetail = (event) => {
    setBdetail(event.target.value);
  };

  const updateName = (event) => {
    setBname(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    // console.log("Selected image file:", selectedImage);
    setSelectedImageFile(selectedImage);
    setBookImage(URL.createObjectURL(selectedImage));
  };

  const editBook = () => {
    // console.log("Image before sending:", selectedImageFile);

    const formData = new FormData();
    formData.append("article_id", bookid);
    formData.append("article_name", bname);
    formData.append("article_detail", bdetail);
    if (selectedImageFile) {
      formData.append("article_image", selectedImageFile);
    }

    apiClient
      .post("api/updatebook", formData)
      .then((response) => {
        cancelEditBook();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {/* waite... data */}
      <LoadingPage open={isLoadedBtn} />
      <Header />

      <section>
        <h1>แก้ไขบทความ</h1>

        <div className="grid-containerE">
          <div className="fgE">
            <form className="form-group">
              <h2>กรุณากรอกรายละเอียดบทความที่ต้องการแก้ไข</h2>
              <div className="mb-3">
                <label htmlFor="bookname">ชื่อบทความ</label>
                <input
                  type="text"
                  className="form-control"
                  id="bookname"
                  value={bname}
                  onChange={updateName}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="articledetail">เนื้อหา</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="articledetail"
                  value={bdetail}
                  onChange={updateBdetail}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="bookimage">
                  รูปหน้าปกบทความ
                  <cite style={{ color: "red" }}>
                    *ขนาดรูปที่แนะนำคือ 500x500
                  </cite>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="bookimage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="d-flex justify-content-center align-items-center">
                  {bookImage && (
                    <img
                      src={bookImage}
                      alt="Uploaded Image"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  )}
                </div>
              </div>
              <hr className="line1" />
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
                  <Button className="btnE btn-primary" onClick={editBook}>
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

export default Editbook;
