import { useState } from 'react';
import fetcher from '../api/fetcher';
import useUserContext from './useUserContext';

export default function useDeleteProfilePicture() {
  const [deleteMessage, setDeleteMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingDeleteState, setIsLoading] = useState(false);
  const userContext = useUserContext();

  const deleteProfilePicture = async (pictureId: string) => {
    console.log(pictureId);
    try {
      setIsLoading(true);
      const { message, updatedUser } = await fetcher(
        'http://localhost:4000/user/photo',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              document.cookie
                ?.split('; ')
                ?.find((value) => value?.includes('token'))
                ?.split('=')[1]
            }`,
          },
          body: JSON.stringify({
            pictureId,
          }),
        }
      );
      console.log(updatedUser);
      setDeleteMessage(message);
      userContext?.dispatch({ type: 'LOGIN', payload: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteProfilePicture,
    deleteMessage,
    errorMessage,
    isLoadingDeleteState,
  };
}
