import { useState, useEffect } from 'react';
import { Project, Service, SupportQuery } from '../types';
import { getProjects, getServices, getSupportQueries } from '../services/firestore';


export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: () => fetchProjects() };
};


export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesData = await getServices();
        setServices(servicesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error, refetch: () => fetchServices() };
};


export const useSupportQueries = () => {
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const queriesData = await getSupportQueries();
        setQueries(queriesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch support queries');
        console.error('Error fetching support queries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  return { queries, loading, error, refetch: () => fetchQueries() };
};