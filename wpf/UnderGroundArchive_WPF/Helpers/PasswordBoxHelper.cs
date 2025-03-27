using System.Windows;
using System.Windows.Controls;

namespace UnderGroundArchive_WPF.Helpers
{
    public static class PasswordBoxHelper
    {
        public static readonly DependencyProperty PasswordProperty =
            DependencyProperty.RegisterAttached(
                "Password",
                typeof(string),
                typeof(PasswordBoxHelper),
                new FrameworkPropertyMetadata(string.Empty, OnPasswordPropertyChanged));

        public static string GetPassword(DependencyObject obj)
        {
            return (string)obj.GetValue(PasswordProperty);
        }

        public static void SetPassword(DependencyObject obj, string value)
        {
            obj.SetValue(PasswordProperty, value);
        }

        private static void OnPasswordPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is PasswordBox passwordBox)
            {
                // Avoid updating the PasswordBox if the value hasn't changed
                if (passwordBox.Password != (string)e.NewValue)
                {
                    // Temporarily remove the event handler to avoid a loop
                    passwordBox.PasswordChanged -= PasswordBox_PasswordChanged;
                    passwordBox.Password = (string)e.NewValue;
                    passwordBox.PasswordChanged += PasswordBox_PasswordChanged;
                }
            }
        }

        private static void PasswordBox_PasswordChanged(object sender, RoutedEventArgs e)
        {
            if (sender is PasswordBox passwordBox)
            {
                // Update the attached property only if the value has changed
                if (GetPassword(passwordBox) != passwordBox.Password)
                {
                    SetPassword(passwordBox, passwordBox.Password);
                }
            }
        }
    }
}