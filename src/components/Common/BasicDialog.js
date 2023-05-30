import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function BasicDialog({open, setOpen, title, children=null, size="sm"}){

    const onCloseClick = () => {
        setOpen(false)
    }

    return (
        <Modal 
            isOpen={open} 
            toggle={onCloseClick} 
            centered={true} 
            backdrop={'static'} 
            keyboard={false} 
            className="overflow-hidden"
            size={size}
        >
            <ModalHeader toggle={onCloseClick} className="py-2 bg-secondary bg-soft">{title}</ModalHeader>
            <ModalBody className="py-3 px-5">
                {children}
            </ModalBody>
        </Modal>
    );

}