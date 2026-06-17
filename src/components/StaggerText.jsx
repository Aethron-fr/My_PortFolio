import { motion } from 'framer-motion';

export default function StaggerText({ text, delay = 0, className = '', style = {} }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 15,
      filter: 'blur(4px)',
    },
  };

  return (
    <motion.div
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em', ...style }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} style={{ display: 'inline-block' }}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
