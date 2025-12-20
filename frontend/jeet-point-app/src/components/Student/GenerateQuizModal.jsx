import { Dialog } from "@headlessui/react";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { X } from "lucide-react";


export default function GenerateQuizModal({ isOpen, onClose, subject }) {
  const { user } = useContext(AuthContext);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [qstnCount, setQstnCount] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const allChapterOptions = {
  Physics: [
  "Units and Measurements",
  "Kinematics",
  "Laws of Motion",
  "Work, Energy and Power",
  "Rotational Motion",
  "Gravitation",
  "Properties of Solids and Liquids",
  "Thermodynamics",
  "Kinetic Theory of Gases",
  "Oscillations and Waves",
  "Electrostatics",
  "Current Electricity",
  "Magnetic Effects of Current and Magnetism",
  "Electromagnetic Induction and Alternating Currents",
  "Electromagnetic Waves",
  "Optics",
  "Dual Nature of Matter and Radiation",
  "Atoms and Nuclei",
  "Electronic Devices",
],
  Chemistry: [
  "Some Basic Concepts in Chemistry",
  "Atomic Structure",
  "Chemical Bonding and Molecular Structure",
  "Chemical Thermodynamics",
  "Solutions",
  "Equilibrium",
  "Redox Reactions and Electrochemistry",
  "Chemical Kinetics",
  "Classification of Elements and Periodicity in Properties",
  "p-Block Elements",
  "d- and f-Block Elements",
  "Coordination Compounds",
  "Purification and Characterisation of Organic Compounds",
  "Some Basic Principles of Organic Chemistry",
  "Hydrocarbons",
  "Organic Compounds Containing Halogens",
  "Organic Compounds Containing Oxygen",
  "Organic Compounds Containing Nitrogen",
  "Biomolecules",
  "Principles Related to Practical Chemistry"
]
,
  Biology: [
  "Diversity in Living World",
  "Structural Organisation in Animals and Plants",
  "Cell Structure and Function",
  "Plant Physiology",
  "Human Physiology",
  "Reproduction",
  "Genetics and Evolution",
  "Biology and Human Welfare",
  "Biotechnology and Its Applications",
  "Ecology and Environment"
],
  Mathematics: [
  "SETS, RELATIONS AND FUNCTIONS",
  "COMPLEX NUMBERS AND QUADRATIC EQUATIONS",
  "MATRICES AND DETERMINANTS",
  "PERMUTATIONS AND COMBINATIONS",
  "BINOMIAL THEOREM AND ITS SIMPLE APPLICATIONS",
  "SEQUENCE AND SERIES",
  "LIMIT, CONTINUITY AND DIFFERENTIABILITY",
  "INTEGRAL CALCULAS",
  "DIFFRENTIAL EQUATIONS",
  "CO-ORDINATE GEOMETRY",
  "THREE DIMENSIONAL GEOMETRY",
  "VECTOR ALGEBRA",
  "STATISTICS AND PROBABILITY",
  "TRIGONOMETRY"
]
};

const chapterOptions = allChapterOptions[subject] || [];


  const toggleChapter = (chapter) => {
    setSelectedChapters((prev) =>
      prev.includes(chapter)
        ? prev.filter((c) => c !== chapter)
        : [...prev, chapter]
    );
  };

  const handleGenerate = () => {
    setConfirmOpen(true);
  };

  const confirmGenerate = () => {
    setConfirmOpen(false);
    onClose(); // Close main modal too
    // Redirect
    window.location.href = `/StudentDASH/quizattempt?subject=${subject}&chapters=${selectedChapters.join(",")}&count=${qstnCount}`;
  };

  return (
    <>
      <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-full sm:max-w-lg w-full rounded-xl p-6 relative shadow-xl max-h-[90vh]">
            <button className="absolute top-4 right-4" onClick={onClose}>
              <X />
            </button>

            <Dialog.Title className="text-2xl font-bold mb-4 text-[#160533]">
              Generate {subject} Quiz
            </Dialog.Title>

            <div className="mb-3">
              <label className="font-semibold">Select Chapters</label>
              <div className="mt-2">
                <div className="overflow-auto pr-2 max-h-48 sm:max-h-64 md:max-h-72">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chapterOptions.map((chapter) => (
                      <button
                        key={chapter}
                        onClick={() => toggleChapter(chapter)}
                        className={`w-full text-left py-2 px-3 rounded-md border ${
                          selectedChapters.includes(chapter)
                            ? "bg-violet-200 border-violet-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {chapter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="font-semibold">Number of Questions</label>
              <select
                value={qstnCount}
                onChange={(e) => setQstnCount(Number(e.target.value))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                {[10, 15, 20, 25, 30].map((count) => (
                  <option key={count} value={count}>
                    {count} Questions
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition duration-200"
            >
              Generate Quiz
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog
        as="div"
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-sm w-full rounded-xl p-6 shadow-xl text-center">
            <Dialog.Title className="text-xl font-bold mb-2">Are you sure?</Dialog.Title>
            <p className="mb-4">
              Generate a quiz with <strong>{qstnCount}</strong> questions from{" "}
              <strong>{selectedChapters.length}</strong> chapter(s)?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmGenerate}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
              >
                Yes, Generate
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
