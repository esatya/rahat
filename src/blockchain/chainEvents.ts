import { Prisma } from '@prisma/client';
import { bufferToHexString } from '@utils/string-format';
import { ChainActions as RahatActions } from './event-handlers/Rahat';
import { ChainActions as RahatDonorActions } from './event-handlers/RahatDonor';

export const chainEvents = {
  Rahat: RahatActions,
  RahatDonor: RahatDonorActions,
};

export const processChainEvents = (
  txData: Prisma.TransactionUpdateInput,
  where: Prisma.TransactionWhereInput,
) => {
  const events = <Prisma.JsonArray>txData.events;
  const contractName = <string>txData.contractName || '';
  const txHash = bufferToHexString(<Buffer>where?.txHash);

  events.forEach((e: any) => {
    try {
      const action = chainEvents?.[contractName]?.[e.name];
      if (action) action(e, txHash, txData);
    } catch (e) {
      console.log(e.message);
    }
  });
};
