import { Card ,CardBody,Typography,} from "@material-tailwind/react";


function Features(){

    const cardData=[
        {
            icon:<div className="text-5xl text-blue-600">📚</div>,
            title:"Subject-Wise Quizzes",
            desc:"Target each subject individually with curated quizzes for Physics, Chemistry, Maths, and Biology — one concept at a time."
        },
        {
            icon:<div className="text-5xl text-blue-600">📜</div>,
            title:"Attempt History",
            desc:"Access all your past quizzes in one place — review scores, mistakes, and improvements over time."
        },
        {
            icon:<div className="text-5xl text-blue-600">📊</div>,
            title:"Progress Tracking",
            desc:"See your growth clearly — analyze scores, accuracy, and improvement trends to track your learning curve."
        },
        {
            icon:<div className="text-5xl text-blue-600">🏆</div>,
            title:"Leaderboard Challenges",
            desc:"Climb the ranks by competing with other aspirants. Stay motivated by seeing where you stand"
        },
        {
            icon:<div className="text-5xl text-blue-600">💡</div>,
            title:"Instant Feedback",
            desc:"No delays — get correct answers and explanations immediately to reinforce learning instantly."
        },
        {
            icon:<div className="text-5xl text-blue-600">🚀</div>,
            title:"Code-Based Quiz Access",
            desc:"Join quizzes instantly using a unique code or shared link from teachers or friends."
        },
        
        
    ];

    function InfoCard({icon,title,desc}){
            return(
                <Card className="w-full shadow-lg rounded-3xl p-6 sm:p-8">
                    <CardBody>
                        <div className="mb-4 h-12 w-12 text-gray-900 text-3xl sm:text-4xl">{icon}</div>
                        <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                            {title}
                        </Typography>
                        <Typography className="text-sm sm:text-base">{desc}</Typography>
                    </CardBody>
                </Card>
            );
    }

    return<>

        <div id="features" className=" flex mt-15 flex-col items-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-notosans font-bold mb-3 text-center">Your Journey to JEET Starts here</h1>
                <p className="text-base sm:text-lg">The smart way to prepare for JEE and NEET</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-8">
            {
                cardData.map((item,index)=>(
                    <InfoCard key={index} icon={item.icon} title={item.title} desc={item.desc}/>
                ))
            }
        </div>
    </>
}
export default Features;