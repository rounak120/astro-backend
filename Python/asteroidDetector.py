from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
import pandas as pd
import plotly.graph_objs as go
from plotly.subplots import make_subplots
import numpy as np

def perform_dbscan(X, radius, min_samples):
    # Scale the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Create DBSCAN object
    dbscan = DBSCAN(eps=radius, min_samples=min_samples)
    
    # Fit the data and obtain the predicted labels
    dbscan.fit(X_scaled)
    labels = dbscan.labels_
    
    return labels


def plot(datasets, labels):
    #colour pattern
    colorscale = ['white','red','blue']

    # Define the layout for the plot
    layout = go.Layout(
        margin=dict(l=0, r=0, b=0, t=0),
        scene=dict(
            xaxis=dict(title='X'),
            yaxis=dict(title='Y'),
            zaxis=dict(title='Z'),
            aspectmode='data',
            aspectratio=dict(x=1, y=1, z=1),
            bgcolor='black',
           
            camera=dict(
                up=dict(x=0, y=0, z=1),
            ),
        ),
        paper_bgcolor='black',
    )

    #figure 1
    trace = go.Scatter3d(
        x=datasets[:, 0],
        y=datasets[:, 1],
        z=datasets[:, 2],
        mode='markers',
        marker=dict(
            color="white",
            size=1,
            opacity=1,
            
        ),
    )

    #figure 2
    trace1 = go.Scatter3d(
        x=datasets[:,0],
        y=datasets[:,1],
        z=datasets[:,2],
        mode='markers',
        marker=dict(
            color=labels,
            colorscale=colorscale,
            size=1,
            opacity=1,
            
        ),
    )

    #figure 3
    dataset=datasets[np.where(labels!=-1)]
    label=labels[np.where(labels!=-1)]
    colorscale=colorscale[1:]
    trace2 = go.Scatter3d(
        x=dataset[:,0],
        y=dataset[:,1],
        z=dataset[:,2],
        mode='markers',
        marker=dict(
            color=label,
            colorscale=colorscale,
            size=1,
            opacity=1,
            
        ),
    )
    fig = make_subplots(rows=1, cols=3, specs=[[{'type': 'scatter3d'}]*3]*1)
    fig.update_layout(layout)

    fig.add_trace(trace, row=1, col=1)
    fig.add_trace(trace1, row=1, col=2)
    fig.add_trace(trace2, row=1, col=3)
    
    for template in ["plotly", "plotly_white", "plotly_dark", "ggplot2", "seaborn", "simple_white", "none"]:
        fig.update_layout(template=template)
    return fig
    
    
datasets = pd.read_csv("./asteroid_belt.csv",sep=",",header=None)
datasets=np.array(datasets)
labels=perform_dbscan(datasets,0.1,7)    
fig=plot(datasets,labels)
fig.write_html("asteroid.html")
fig.show()