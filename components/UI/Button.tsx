// components/UI/Button.tsx

const Button = ({ text, onClick, className }: { text: string; onClick: () => void; className?: string }) => {
    return (
      <button
        onClick={onClick}
        className={`px-5 py-3 rounded-lg ${className ? className : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        {text}
      </button>
    );
  };
  
  export default Button;
  