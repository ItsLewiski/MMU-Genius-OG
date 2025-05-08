"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Award, Users, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function About() {
  const router = useRouter()

  const handleJoinUs = () => {
    router.push("/register")
  }

  const handleLearnMore = () => {
    // Scroll to the values section
    document.getElementById("values-section")?.scrollIntoView({ behavior: "smooth" })
  }

  // Update the teamMembers array to include the new image path for Mricho
  const teamMembers = [
    {
      name: "Lewiski",
      role: "CEO & Co-Founder",
      image: "/assets/images/team/founder.png",
      bio: "As a Software Engineering student at Multimedia University, I experienced firsthand the challenges of effective studying and knowledge retention. This inspired me to create a tool that would help students like me study more efficiently and effectively. My vision is to make quality education more accessible and to empower students with the tools they need to succeed in their academic journey and beyond.",
    },
    {
      name: "Emilio",
      role: "Chief Operating Officer (COO)",
      image: "/assets/images/team/emilio-coo.png",
      bio: "As COO and a Software Engineering student at Multimedia University, I oversee the day-to-day operations of MMU Genius. My focus is on streamlining processes and ensuring our platform delivers exceptional value to students. I'm passionate about operational excellence and creating systems that help students achieve their academic goals.",
    },
    {
      name: "Michael",
      role: "Chief Financial Officer (CFO)",
      image: "/assets/images/team/michael-cfo.png",
      bio: "I manage the financial strategy and planning for MMU Genius while pursuing my Software Engineering degree at Multimedia University. My background in both finance and technology helps me balance innovation with sustainable growth. I'm committed to making our premium educational tools accessible to all students.",
    },
    {
      name: "Gideon",
      role: "Chief Technology Officer (CTO)",
      image: "/assets/images/team/gideon-cto.png",
      bio: "As CTO and a Software Engineering student at Multimedia University, I lead the technical development of MMU Genius. My expertise in AI and machine learning drives our innovative study tools. I'm dedicated to creating technology that adapts to each student's unique learning style and needs.",
    },
    {
      name: "Mricho",
      role: "Chief Marketing Officer (CMO)",
      image: "/assets/images/team/mricho-cmo.png",
      bio: "I head the marketing initiatives at MMU Genius while completing my Software Engineering degree at Multimedia University. My passion lies in communicating how our AI-powered tools can transform the student experience. I focus on building community and ensuring students discover the resources they need to excel.",
    },
  ]

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About MMU Genius</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Empowering students with AI-powered study tools to learn smarter, not harder.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            At MMU Genius, we're on a mission to transform how students study and learn. We believe that with the right
            tools, every student can unlock their full potential and achieve academic excellence.
          </p>
          <p className="text-lg mb-4">
            Our AI-powered platform helps students digest complex information, retain knowledge more effectively, and
            prepare for exams with confidence.
          </p>
          <div className="flex gap-4 mt-6">
            <Button className="bg-study-purple hover:bg-study-blue text-white" onClick={handleJoinUs}>
              Join Us
            </Button>
            <Button variant="outline" onClick={handleLearnMore}>
              Learn More
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 flex flex-col items-center text-center">
            <BookOpen className="h-12 w-12 text-study-purple mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Summaries</h3>
            <p className="text-muted-foreground">Transform lengthy notes into concise, easy-to-understand summaries.</p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center">
            <Award className="h-12 w-12 text-study-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Interactive Flashcards</h3>
            <p className="text-muted-foreground">Create and study with AI-generated flashcards for better retention.</p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-study-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Practice Questions</h3>
            <p className="text-muted-foreground">Test your knowledge with customized practice questions.</p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center">
            <Lightbulb className="h-12 w-12 text-study-accent2 mb-4" />
            <h3 className="text-xl font-bold mb-2">Study Smarter</h3>
            <p className="text-muted-foreground">Optimize your study time with personalized learning tools.</p>
          </Card>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>

        {/* Founder section - now in card format */}
        <div className="mb-12">
          <div className="border-4 border-study-purple rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 team-member-card">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 p-6 flex justify-center items-center bg-gradient-to-br from-study-purple/10 to-study-blue/10">
                <div className="w-48 h-48 rounded-full overflow-hidden relative border-4 border-study-purple p-1 shadow-lg">
                  <Image
                    src={teamMembers[0].image || "/placeholder.svg"}
                    alt={`${teamMembers[0].name} - ${teamMembers[0].role}`}
                    width={192}
                    height={192}
                    className="object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center mb-4">
                  <h3 className="text-2xl font-bold">{teamMembers[0].name}</h3>
                  <span className="ml-3 px-3 py-1 bg-study-purple text-white text-sm font-medium rounded-full">
                    {teamMembers[0].role}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="mb-4 italic">
                    "I am {teamMembers[0].name}, the {teamMembers[0].role} of MMU Genius. As a Software Engineering
                    student at Multimedia University, I experienced firsthand the challenges of effective studying and
                    knowledge retention. This inspired me to create a tool that would help students like me study more
                    efficiently and effectively."
                  </p>
                  <p className="mb-4">
                    "With a background in Software Engineering and a passion for education technology, I've led the
                    development of MMU Genius from a simple idea to a comprehensive study platform that's helping
                    students achieve their academic goals."
                  </p>
                  <p>
                    "My vision is to make quality education more accessible and to empower students with the tools they
                    need to succeed in their academic journey and beyond."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.slice(1).map((member, index) => (
            <div
              key={index}
              className="border-2 hover:border-study-blue rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 team-member-card"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden relative flex-shrink-0 team-member-image mx-auto sm:mx-0">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={`${member.name} - ${member.role}`}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-center sm:text-left">{member.name}</h3>
                  <p className="text-sm text-study-purple mb-3 text-center sm:text-left font-medium">{member.role}</p>
                  <p className="text-sm">{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="values-section">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p className="text-muted-foreground">
              We continuously explore new technologies and approaches to improve the learning experience.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3">Accessibility</h3>
            <p className="text-muted-foreground">
              We believe that quality education tools should be accessible to all students.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3">Student-Centered</h3>
            <p className="text-muted-foreground">
              Everything we build is designed with students' needs and success in mind.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
