














"use client";







import { useState, useCallback } from "react";







import {







  Textarea,







  Button,







  Card,







  Spinner,







  Skeleton,







  CardHeader,







  CardBody,







  CardFooter,







} from "@heroui/react";







import { IconPlayerPlay, IconSend, IconSparkles } from "@tabler/icons-react";















export default function DoubtsPage() {







  const [doubt, setDoubt] = useState("");







  const [isLoading, setIsLoading] = useState(false);







  const [course, setCourse] = useState<{







    title: string;







    description: string;







  } | null>(null);















  const handleSubmit = useCallback(() => {







    if (!doubt) return;















    setIsLoading(true);







    setCourse(null);















    setTimeout(() => {







      setCourse({







        title: "Generated Course Title",







        description:







          "This is a sample course description generated based on your doubt.",







      });







      setIsLoading(false);







    }, 2000);







  }, [doubt]);















  const handleReset = () => {







    setDoubt("");







    setCourse(null);







  };















  return (







    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background">







      <div className="absolute inset-0 z-0 overflow-hidden">







        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-pulse" />







        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-pulse" />







      </div>















      <div className="relative z-10 w-full max-w-4xl">







        {!course && !isLoading && (







          <div className="flex flex-col items-center text-center">







            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 flex items-center gap-2">







              <IconSparkles size={48} />







              Doubts







            </h1>







            <p className="text-muted mb-8 max-w-2xl">







              Have a question about a topic? Ask away and our AI will generate a







              customized course to help you understand it better.







            </p>







            <Textarea







              variant="bordered"







              placeholder="Tell us what your doubt is..."







              value={doubt}







              onChange={(e) => setDoubt(e.target.value)}







              className="mb-4 min-h-[150px]"







            />







            <Button







              onClick={handleSubmit}







              disabled={!doubt}







              color="primary"







              shadow="md"







              endContent={<IconSend size={20} />}







            >







              Submit







            </Button>







          </div>







        )}















        {isLoading && (







          <Card className="w-full" shadow="lg">







            <CardHeader>







              <Skeleton className="h-8 w-3/5 rounded-md" />







            </CardHeader>







            <CardBody>







              <div className="space-y-4">







                <Skeleton className="h-4 w-4/5 rounded-md" />







                <Skeleton className="h-4 w-full rounded-md" />







                <Skeleton className="h-4 w-2/3 rounded-md" />







              </div>







            </CardBody>







            <CardFooter>







              <Skeleton className="h-12 w-32 rounded-md" />







            </CardFooter>







          </Card>







        )}















        {course && (







          <Card isBlurred shadow="lg" className="border border-white/10">







            <CardHeader className="flex justify-between items-center">







              <h2 className="text-2xl font-bold text-foreground">







                {course.title}







              </h2>







              <Button variant="light" onClick={handleReset}>







                Ask another doubt







              </Button>







            </CardHeader>







            <CardBody>







              <p className="text-muted">{course.description}</p>







            </CardBody>







            <CardFooter className="flex justify-end">







              <Button color="success" variant="shadow" size="lg">







                Attempt







              </Button>







            </CardFooter>







          </Card>







        )}







      </div>







    </div>







  );







}












