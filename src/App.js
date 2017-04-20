import React, {Component} from 'react';
import createBrowserHistory from 'history/createBrowserHistory';
import {
    HashRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import './App.css';

class ProductList extends Component {
    render() {
        var products = this.props.products.map((product) => {
            var classes = '';
            console.log(this.props.filters);
            for(var criteria in this.props.filters) {
                if(this.props.filters.hasOwnProperty(criteria)) {
                    var criterion = this.props.filters[criteria];
                    classes = (typeof criterion !== 'undefined' && criterion.indexOf(product.specs[criteria].toString()) === -1)
                        ? 'hidden' : classes;
                }
            }
            return (
                <li key={product.id} className={ classes }>
                    <a href="#" className="product-photo">
                        <img src={product.image.small} height="130" alt={product.name}/>
                    </a>
                    <h2>
                        <a href="#">{product.name}</a>
                    </h2>
                    <ul className="product-description">
                        <li><span>Manufacturer: </span>{product.specs.manufacturer}</li>
                        <li><span>Storage: </span>{product.specs.storage} GB</li>
                        <li><span>OS: </span>{product.specs.os}</li>
                        <li><span>Camera: </span>{product.specs.camera} Mpx</li>
                    </ul>
                    <button>Buy Now!</button>
                    <p className="product-price">{product.price}$</p>
                    <Router>
                        <Link to={{pathname: `/product/${product.id}`}}>
                            <div className="highlight"></div>
                        </Link>
                    </Router>
                </li>
            )
        });
        return (
            <ul className="products-list">
                {products}
            </ul>
        )
    }
}
class Product extends Component {
    render() {
        let history = this.props.history;
        const back = (e) => {
            e.stopPropagation();
            history.goBack()
        };
        return (
            <div className="single-product page visible">

                <div className="overlay"></div>

                <div className="preview-large">
                    <h3>{this.props.product.name}</h3>
                    <img src={this.props.product.image.large} alt={this.props.product.name}/>
                    <p>{this.props.product.description}</p>
                    <span className="close" onClick={back}>×</span>
                </div>
            </div>
        )
    }
}

class Filters extends Component {
    render() {
        const criteria = [
            {
                title: "Manufacturer",
                name: "manufacturer",
                items: [
                    {value: "Apple", title: "Apple"},
                    {value: "Samsung", title: "Samsung"},
                    {value: "HTC", title: "HTC"},
                    {value: "Nokia", title: "Nokia"},
                    {value: "ZTE", title: "ZTE"},
                    {value: "Sony", title: "sony"}
                ]
            },
            {
                title: "Storage Size",
                name: "storage",
                items: [
                    {value: "16", title: "16 GB"},
                    {value: "32", title: "32 GB"}
                ]
            },
            {
                title: "OS",
                name: "os",
                items: [
                    {value: "Android", title: "Android"},
                    {value: "iOS", title: "iOS"},
                    {value: "Windows", title: "Windows"}
                ]
            },
            {
                title: "Camera",
                name: "camera",
                items: [
                    {value: "5", title: "5 Mpx"},
                    {value: "8", title: "8 Mpx"},
                    {value: "12", title: "12 Mpx"},
                    {value: "15", title: "15 Mpx"}

                ]
            }
        ];
        var filters = criteria.map(criterion => {
            return (
                <FilterCriteria
                    key={criterion.name}
                    items={criterion.items}
                    filterTitle={criterion.title}
                    filterName={criterion.name}
                    filters={this.props.filters}
                    onFilter={this.props.onFilter}
                />
            );
        });
        return (
            <div className="filters">
                <form>
                    {filters}
                    <button>Clear filters</button>
                </form>
            </div>
        );
    }
}

class FilterCriteria extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let filters = this.props.filters;
        if (e.target.checked) {
            var criteria = filters[e.target.name];
            criteria = ( typeof criteria !== 'undefined' && criteria instanceof Array ) ? criteria : [];
            criteria.push(e.target.value);
        } else {
            if ( typeof filters[e.target.name] !== 'undefined') {
                filters[e.target.name].splice(filters.indexOf(e.target.value), 1);
            }
        }
        filters[e.target.name] = criteria;
        this.props.onFilter(filters);
    }

    render() {
        var items = this.props.items.map(item => (
            <label key={item.value}>
                <input
                    type="checkbox"
                    value={item.value}
                    name={this.props.filterName}
                    onChange={this.handleChange}/>
                {item.title}
            </label>
        ));
        return (
            <div className="filter-criteria">
                <span>{this.props.filterTitle}</span>
                {items}
            </div>
        )
    }
}

class Header extends Component {
    render() {
        return (
            <header className="compact">
                <h2 className="tzine">
                    <a href="http://tutorialzine.com/2015/02/single-page-app-without-a-framework/">Back to article</a>
                </h2>
                <h1>
                    <a href="#">Single Page App With React js library</a>
                </h1>
            </header>
        )
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: []
        };
        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter(filters) {
        this.setState({
            filters: filters
        })
    }

    render() {
        const history = createBrowserHistory();
        const ProductPopup = (props) => {
            var product = {};
            this.props.products.map(
                item => {
                    if (parseInt(props.match.params.id, 10) === item.id) {
                        product = item;
                    }
                    return product;
                }
            );
            return <Product product={product} {...props} />
        };
        return (
            <div>
                <Header />
                <div className="main-content">
                    <div className="all-products page visible">
                        <Filters
                            filters={this.state.filters}
                            onFilter={this.handleFilter}
                        />
                        <ProductList
                            products={this.props.products}
                            filters={this.state.filters}
                        />
                        <Router history={history}>
                            <Route path="/product/:id" component={ProductPopup}/>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
