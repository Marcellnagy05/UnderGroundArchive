using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using UnderGroundArchive_WPF.ViewModels;

namespace UnderGroundArchive_WPF.Views
{
    /// <summary>
    /// Interaction logic for ModeratorView.xaml
    /// </summary>
    public partial class ModeratorView : Window
    {
        public ModeratorView(ModeratorViewModel viewModel)
        {
            InitializeComponent();
            DataContext = viewModel;
        }

    }
}
