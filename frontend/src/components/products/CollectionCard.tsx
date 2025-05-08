import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '../../types/api';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  // Example collection images - in a real app, you'd use actual collection images
  const collectionImages = [
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ];
  
  // Use collection.id as index for demo purposes
  const imageIndex = (collection.id % collectionImages.length);
  const backgroundImage = collectionImages[imageIndex];

  return (
    <Link to={`/collections/${collection.id}`} className="block group">
      <div 
        className="h-64 rounded-lg overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow duration-300"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-1">{collection.title}</h3>
          <p className="text-white text-sm">{collection.product_count} products</p>
        </div>
        <div className="absolute inset-0 bg-primary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
};

export default CollectionCard;