// "use client";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";

// export default function BaseModal({ isOpen, onClose, children, maxWidth = "max-w-md" }) {
//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         {/* Overlay hitam transparan */}
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-70"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-70"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-70" />
//         </Transition.Child>

//         {/* Konten Modal */}
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95 translate-y-4"
//             enterTo="opacity-100 scale-100 translate-y-0"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100 translate-y-0"
//             leaveTo="opacity-0 scale-95 translate-y-4"
//           >
//             <Dialog.Panel
//               className={`bg-white rounded-2xl p-6 shadow-2xl w-full ${maxWidth} backdrop-blur-sm`}
//             >
//               {children}
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }