import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetMe, 
  useLogin, 
  useRegister, 
  useLogout, 
  getGetMeQueryKey 
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useGetMe({
    query: { 
      retry: false,
      refetchOnWindowFocus: false
    }
  });

  const login = useLogin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Welcome back!", description: "You have successfully logged in." });
      },
      onError: (err: any) => {
        toast({ title: "Login failed", description: err.message || "Invalid credentials", variant: "destructive" });
      }
    }
  });

  const register = useRegister({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Account created", description: "Welcome to the platform!" });
      },
      onError: (err: any) => {
        toast({ title: "Registration failed", description: err.message || "An error occurred", variant: "destructive" });
      }
    }
  });

  const logout = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(getGetMeQueryKey(), null);
        toast({ title: "Logged out", description: "You have been securely logged out." });
      }
    }
  });

  return {
    user: error ? null : user,
    isLoading,
    login: login.mutateAsync,
    register: register.mutateAsync,
    logout: logout.mutateAsync,
    isLoggingIn: login.isPending,
    isRegistering: register.isPending,
    isLoggingOut: logout.isPending
  };
}
