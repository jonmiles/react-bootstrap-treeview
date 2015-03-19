

var data = [
  {
    text: 'Parent 1',
    href: '#parent1',
    tags: ['4'],
    nodes: [
      {
        text: 'Child 1',
        href: '#child1',
        tags: ['2'],
        nodes: [
          {
            text: 'Grandchild 1',
            href: '#grandchild1',
            tags: ['0']
          },
          {
            text: 'Grandchild 2',
            href: '#grandchild2',
            tags: ['0']
          }
        ]
      },
      {
        text: 'Child 2',
        href: '#child2',
        tags: ['0']
      }
    ]
  },
  {
    text: 'Parent 2',
    href: '#parent2',
    tags: ['0']
  },
  {
    text: 'Parent 3',
    href: '#parent3',
     tags: ['0']
  },
  {
    text: 'Parent 4',
    href: '#parent4',
    tags: ['0']
  },
  {
    text: 'Parent 5',
    href: '#parent5'  ,
    tags: ['0']
  }
];


var altData = [
  {
    text: 'Parent 1',
    tags: ['2'],
    nodes: [
      {
        text: 'Child 1',
        tags: ['3'],
        nodes: [
          {
            text: 'Grandchild 1',
            tags: ['6']
          },
          {
            text: 'Grandchild 2',
            tags: ['3']
          }
        ]
      },
      {
        text: 'Child 2',
        tags: ['3']
      }
    ]
  },
  {
    text: 'Parent 2',
    tags: ['7']
  },
  {
    text: 'Parent 3',
    icon: 'glyphicon glyphicon-earphone',
    href: '#demo',
    tags: ['11']
  },
  {
    text: 'Parent 4',
    icon: 'glyphicon glyphicon-cloud-download',
    href: '/demo.html',
    tags: ['19'],
    selected: true
  },
  {
    text: 'Parent 5',
    icon: 'glyphicon glyphicon-certificate',
    color: 'pink',
    backColor: 'red',
    href: 'http://www.tesco.com',
    tags: ['available','0']
  }
];


React.render(
  <Tree data={data} />,
  document.getElementById('treeview')
);