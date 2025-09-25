import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Project, Service, SupportQuery } from '../types';


export const projectsCollection = collection(db, 'projects');

export const addProject = async (project: Omit<Project, 'id'>) => {
  try {
    const docRef = await addDoc(projectsCollection, {
      ...project,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const querySnapshot = await getDocs(query(projectsCollection, orderBy('completionDate', 'desc')));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  try {
    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};


export const servicesCollection = collection(db, 'services');

export const addService = async (service: Omit<Service, 'id'>) => {
  try {
    const docRef = await addDoc(servicesCollection, {
      ...service,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

export const getServices = async (): Promise<Service[]> => {
  try {
    const querySnapshot = await getDocs(servicesCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
  } catch (error) {
    console.error('Error getting services:', error);
    throw error;
  }
};


export const supportQueriesCollection = collection(db, 'supportQueries');

export const addSupportQuery = async (query: Omit<SupportQuery, 'id' | 'date' | 'status'>) => {
  try {
    const docRef = await addDoc(supportQueriesCollection, {
      ...query,
      status: 'pending',
      date: Timestamp.now().toDate().toISOString(),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding support query:', error);
    throw error;
  }
};

export const getSupportQueries = async (): Promise<SupportQuery[]> => {
  try {
    const querySnapshot = await getDocs(query(supportQueriesCollection, orderBy('createdAt', 'desc')));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SupportQuery[];
  } catch (error) {
    console.error('Error getting support queries:', error);
    throw error;
  }
};

export const updateSupportQueryStatus = async (id: string, status: SupportQuery['status'], response?: string) => {
  try {
    const queryRef = doc(db, 'supportQueries', id);
    await updateDoc(queryRef, {
      status,
      response,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating support query:', error);
    throw error;
  }
};


export const questionnaireSubmissionsCollection = collection(db, 'questionnaireSubmissions');

export const addQuestionnaireSubmission = async (submission: any) => {
  try {
    const docRef = await addDoc(questionnaireSubmissionsCollection, {
      ...submission,
      submittedAt: Timestamp.now(),
      status: 'new'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding questionnaire submission:', error);
    throw error;
  }
};

export const getQuestionnaireSubmissions = async () => {
  try {
    const querySnapshot = await getDocs(query(questionnaireSubmissionsCollection, orderBy('submittedAt', 'desc')));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting questionnaire submissions:', error);
    throw error;
  }
};