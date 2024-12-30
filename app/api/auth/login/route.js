// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { sessionOptions } from '@/lib/session';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { withIronSessionApiRoute } from 'iron-session/next';

async function handler(req, res) {
  try {
    // Vérifiez si la méthode est POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { email, password } = req.body;

    // Recherchez l'utilisateur dans Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();

    // Vérifiez le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Ajoutez les données utilisateur à la session
    req.session.user = { id: userDoc.id, email: user.email };
    await req.session.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Ajoutez `withIronSessionApiRoute` pour gérer la session
export default withIronSessionApiRoute(handler, sessionOptions);
