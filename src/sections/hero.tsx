import { motion } from "motion/react";

const Hero = () => {
  return (
    <main className="text-white flex justify-center md:items-center md:flex-1 w-full">
      <div className="flex flex-col justify-center items-center py-24 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.8 }}
          className="font-bold text-center bg-linear-to-b from-white to-purple-400 text-transparent bg-clip-text md:text-6xl text-4xl max-w-2xs md:max-w-md mb-6 md:mb-9"
        >
          Chat with your documents.
          <br />
          Learn faster.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-xl text-center mb-8 max-w-3xs md:max-w-xs tracking-tight"
        >
          DocPilot uses advanced AI to instantly summarize and answer questions
          about your documents.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.8, delay: 0.2 }}
          className="relative transition-transform ease-out hover:scale-105 overflow-hidden rounded-lg w-fit bg-violet-600 text-white px-4 py-2 text-sm md:text-lg"
        >
          <button className="relative  z-10 font-medium">Try Now</button>
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/30 to-transparent z-0" />
        </motion.div>
      </div>
    </main>
  );
};

export default Hero;
