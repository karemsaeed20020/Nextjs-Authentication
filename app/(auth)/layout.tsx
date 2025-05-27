"use client";
import Image from "next/image";
import React from "react";
import banner from "../../public/images/auth-illustration.png";
import Logo from "../../public/icons/logo.svg";
import { motion } from "framer-motion";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const sectionVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const imageSectionVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  const logoAndTitleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="relative flex min-h-screen flex-col text-light-100 sm:flex-row bg-[#111624]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.section
        className="flex w-full flex-1 items-center justify-center bg-dark-100 px-5 py-10 sm:bg-pattern sm:bg-cover sm:bg-top"
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-xl w-full rounded-lg p-6 sm:p-10">
          <motion.div
            className="mb-6 flex flex-row items-center justify-center gap-3"
            variants={logoAndTitleVariants}
          >
            <Image src={Logo} alt="BookWise Logo" width={37} height={37} />
            <h1 className="text-2xl font-semibold text-white">BookWise</h1>
          </motion.div>
          <motion.div variants={sectionVariants}>{children}</motion.div>
        </div>
      </motion.section>

      <motion.section
        className="sticky top-0 hidden h-screen w-full sm:flex sm:flex-1"
        variants={imageSectionVariants}
      >
        <Image
          src={banner}
          alt="Authentication Illustration"
          width={1000}
          height={1000}
          className="size-full object-cover"
        />
      </motion.section>
    </motion.div>
  );
};

export default Layout;