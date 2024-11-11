import Swal, { SweetAlertIcon } from 'sweetalert2';

export function openSweetAlertModal(
  title: string,
  text: string,
  icon: SweetAlertIcon,
  confirmButtonText: string,
  cancelButtonText: string,
) {
  let showCancelButton, showConfirmButton = false;
  if (confirmButtonText != undefined && confirmButtonText != "") {
    showConfirmButton = true;
  }
  if (cancelButtonText != undefined && cancelButtonText != "") {
    showCancelButton = true;
  }
  return (Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: showCancelButton,
    showConfirmButton: showConfirmButton,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText
  }))
}
