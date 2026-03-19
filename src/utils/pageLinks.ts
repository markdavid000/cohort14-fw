import { Home } from '../pages/Home';
import { Transactions } from '../pages/Transactions';
import { Landing } from '../pages/Landing';
import { CreateTransaction } from '../pages/CreateTransaction';
import { ApproveTransaction } from '../pages/ApproveTransaction';
import { ChangeSigner } from '../pages/Changesigner';
import { ChangeOwner } from '../pages/Changeowner';

export interface RouteConfig {
    component: React.ComponentType;
    path: string;
}

export const GeneralPages: RouteConfig[] = [
    { component: Home, path: '/home' },
    { component: Landing, path: '/' },
    { component: Transactions, path: '/transactions' },
    { component: CreateTransaction, path: '/new-transaction' },
    { component: Landing, path: '/landing' },
    { component: ApproveTransaction, path: '/approve' },
    { component: ChangeOwner, path: 'settings/change-owner' },
    { component: ChangeSigner, path: 'settings/change-signer' },
]