
import { Star } from 'lucide-react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ReviewCardProps {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewCard = ({ clientName, rating, comment, date }: ReviewCardProps) => {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{clientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{clientName}</CardTitle>
              <CardDescription>{date}</CardDescription>
            </div>
          </div>
          <div className="flex">{renderStars(rating)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
