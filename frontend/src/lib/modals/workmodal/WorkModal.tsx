import "@/lib/modals/workmodal/WorkModal.css";

type WorkModalProps = {
  title: string;
};
const WorkModal = (props: WorkModalProps) => {
  return (
    <div
      className=" fixed inset-0 w-screen h-screen backdrop-blur bg-transparent z-[2000] 
    flex flex-col gap-16 justify-center items-center"
    >
      <div className=" text-purple-500 font-bold text-4xl lm:text-6xl font-be-veitnam-pro">
        {props.title}
      </div>
      <div className="workModal"></div>
    </div>
  );
};

export default WorkModal;
