import { Prisma } from '@prisma/client';

const shortenPrismaMessage = (message: string): string => {
  const shortMessage = message.substring(message.indexOf('→'));
  return shortMessage
    .substring(shortMessage.indexOf('\n'))
    .replace(/\n/g, '')
    .trim();
};

export const PrimsaFriendlyErrorMessage = (
  execption: Prisma.PrismaClientKnownRequestError,
) => {
  let message = 'Error occured';

  if (execption.code === 'P2002') {
    const field = (<[]>execption.meta.target).join('.');
    message = `Duplicate entry in [${field}] is not allowed.`;
  } else {
    message = shortenPrismaMessage(execption.message);
  }
  return message;
};
