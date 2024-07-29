import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { Socket } from "socket.io-client";


const DashboardSocketListener = (socket: Socket) => {
  // listen for project operations
  socket.on('project-update', (data) => {
    toast.info(`${data}`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    });
  });

  socket.on('project-add', (data) => {
    toast.info(`${data}`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    });
  });

  socket.on('project-delete', (data) => {
    toast.info(`${data}`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    });
  });


  // listen for collaboration request
  socket.on('collaboration-request', (data) => {
    toast.info(`${data}`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    });
  });

};

export default DashboardSocketListener;
