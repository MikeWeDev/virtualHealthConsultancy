// components/Doctor/DoctorCard.tsx

interface DoctorCardProps {
    name: string;
    specialty: string;
    photo: string;
  }
  
  const DoctorCard = ({ name, specialty, photo }: DoctorCardProps) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <img src={photo} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h3 className="text-xl font-bold text-center">{name}</h3>
        <p className="text-center text-gray-600">{specialty}</p>
      </div>
    );
  };
  
  export default DoctorCard;
  