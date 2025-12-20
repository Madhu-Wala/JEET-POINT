function About(){
        return (
            <section id="about" className="mt-12 mb-12 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                        <img src="/aboutimg.png" alt="About JEET Point" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-cover rounded-xl" />
                    </div>

                    <div className="w-full md:w-1/2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Empowering Every Aspirant to Succeed</h2>
                        <p className="text-base sm:text-lg text-gray-700">
                            JEET Point is a modern, student-friendly quiz platform designed especially for JEE and NEET aspirants. Whether you're self-studying or guided by a teacher, our tools help you practice effectively, track your progress, and stay motivated throughout your preparation journey.

                            With subject-wise quizzes, instant feedback, and leaderboard challenges, JEET Point turns exam prep into a focused and engaging experience — all accessible in just a few clicks.

                            Our mission is simple: to help you master every concept, one question at a time.
                        </p>
                    </div>
                </div>
            </section>
        );
}
export default About;