import Modal from "react-bootstrap/Modal";
import React from "react";
import Loading from "./LoadingIndicator";

function LoadingPage({ open }) {
  return (
    <>
      <Modal show={open}>
        <Modal.Header>
          <Modal.Title>กำลังโหลดข้อมูล.....</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loading />
        </Modal.Body>
      </Modal>
    </>
  );
}
export default LoadingPage;
