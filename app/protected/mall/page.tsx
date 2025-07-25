import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, 
  Search, 
  Filter,
  Star,
  Heart,
  ExternalLink,
  Gem,
  Sparkles,
  Shield,
  Flame,
  TreePine,
  Moon,
  Sun
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MallPage() {
  // Mock data - 实际实现时需要从数据库获取
  const products = [
    {
      id: "product_1",
      name: "紫水晶聚财手链",
      description: "天然紫水晶打造，有助于提升财运和事业运势，佩戴舒适，设计精美。",
      price: 188.00,
      originalPrice: 288.00,
      image: "/api/placeholder/300/300",
      category: "水晶饰品",
      tags: ["财运", "紫水晶", "手链"],
      rating: 4.8,
      sales: 1230,
      stock: 15,
      isFeatured: true,
      externalUrl: "https://example.com/product1"
    },
    {
      id: "product_2", 
      name: "檀香平安吊坠",
      description: "精选老山檀香木制作，雕工精细，寓意平安健康，香气怡人，可辟邪保平安。",
      price: 128.00,
      originalPrice: 168.00,
      image: "/api/placeholder/300/300",
      category: "木质饰品",
      tags: ["平安", "檀香", "吊坠"],
      rating: 4.9,
      sales: 856,
      stock: 32,
      isFeatured: false,
      externalUrl: "https://example.com/product2"
    },
    {
      id: "product_3",
      name: "五行开运香薰套装",
      description: "根据五行理论调配的天然香薰，包含金木水火土五种香型，平衡能量场。",
      price: 298.00,
      originalPrice: 398.00,
      image: "/api/placeholder/300/300",
      category: "香薰用品",
      tags: ["五行", "香薰", "开运"],
      rating: 4.7,
      sales: 445,
      stock: 8,
      isFeatured: true,
      externalUrl: "https://example.com/product3"
    },
    {
      id: "product_4",
      name: "白玉观音吊坠",
      description: "新疆和田白玉精雕观音像，玉质温润，工艺精湛，寓意慈悲护佑，平安吉祥。",
      price: 588.00,
      originalPrice: 888.00,
      image: "/api/placeholder/300/300",
      category: "玉石饰品",
      tags: ["观音", "白玉", "护身"],
      rating: 4.9,
      sales: 267,
      stock: 5,
      isFeatured: true,
      externalUrl: "https://example.com/product4"
    },
    {
      id: "product_5",
      name: "黑曜石辟邪手串",
      description: "天然黑曜石制作，具有强大的辟邪能量，适合夜班工作者或灵敏体质人群佩戴。",
      price: 88.00,
      originalPrice: 128.00,
      image: "/api/placeholder/300/300",
      category: "水晶饰品",
      tags: ["黑曜石", "辟邪", "手串"],
      rating: 4.6,
      sales: 1456,
      stock: 28,
      isFeatured: false,
      externalUrl: "https://example.com/product5"
    },
    {
      id: "product_6",
      name: "龙龟招财摆件",
      description: "黄铜材质龙龟摆件，寓意长寿招财，适合放置在办公室或家中财位，提升财运。",
      price: 168.00,
      originalPrice: 228.00,
      image: "/api/placeholder/300/300",
      category: "风水摆件",
      tags: ["龙龟", "招财", "摆件"],
      rating: 4.8,
      sales: 678,
      stock: 12,
      isFeatured: false,
      externalUrl: "https://example.com/product6"
    }
  ];

  const categories = [
    { value: "all", label: "全部商品", icon: ShoppingBag },
    { value: "水晶饰品", label: "水晶饰品", icon: Gem },
    { value: "木质饰品", label: "木质饰品", icon: TreePine },
    { value: "玉石饰品", label: "玉石饰品", icon: Moon },
    { value: "香薰用品", label: "香薰用品", icon: Flame },
    { value: "风水摆件", label: "风水摆件", icon: Sun }
  ];

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: any } = {
      "水晶饰品": Gem,
      "木质饰品": TreePine,
      "玉石饰品": Moon,
      "香薰用品": Flame,
      "风水摆件": Sun
    };
    return categoryMap[category] || ShoppingBag;
  };

  const getDiscountPercentage = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">运势商城</h1>
        <p className="text-purple-200">精选开运好物，为您的生活增添正能量</p>
      </div>

      {/* Featured Banner */}
      <Card className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border-purple-700/50 backdrop-blur-sm mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-600">
                  限时特惠
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">新年开运季</h2>
              <p className="text-purple-200 mb-4">
                精选开运商品，助您在新的一年里运势亨通，财源广进！
              </p>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                查看活动商品
              </Button>
            </div>
            <div className="w-48 h-32 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Gem className="h-16 w-16 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
              <Input
                placeholder="搜索开运商品..."
                className="pl-10 bg-slate-700 border-purple-600 text-white"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48 bg-slate-700 border-purple-600">
                <SelectValue placeholder="商品分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48 bg-slate-700 border-purple-600">
                <SelectValue placeholder="价格排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">默认排序</SelectItem>
                <SelectItem value="price-asc">价格从低到高</SelectItem>
                <SelectItem value="price-desc">价格从高到低</SelectItem>
                <SelectItem value="sales">销量排序</SelectItem>
                <SelectItem value="rating">评分排序</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-slate-800/50 border border-purple-700/50">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.value} 
                value={category.value} 
                className="data-[state=active]:bg-purple-600 flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="all" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const CategoryIcon = getCategoryIcon(product.category);
              const discountPercent = getDiscountPercentage(product.price, product.originalPrice);
              
              return (
                <Card key={product.id} className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm hover:border-purple-500 transition-all group">
                  <div className="relative">
                    {/* Product Image */}
                    <div className="aspect-square bg-slate-700/30 rounded-t-lg relative overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <CategoryIcon className="h-24 w-24 text-purple-400" />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isFeatured && (
                          <Badge className="bg-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            推荐
                          </Badge>
                        )}
                        {discountPercent > 0 && (
                          <Badge variant="destructive">
                            -{discountPercent}%
                          </Badge>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="absolute top-3 right-3">
                        {product.stock <= 10 && (
                          <Badge variant="outline" className="border-orange-500 text-orange-400 bg-orange-900/20">
                            仅剩{product.stock}件
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Title and Category */}
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-purple-300">{product.category}</p>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-purple-200 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-purple-300 border-purple-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Rating and Sales */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-purple-200">{product.rating}</span>
                            </div>
                            <span className="text-purple-300">已售{product.sales}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-white">
                            ¥{product.price.toFixed(2)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-purple-400 line-through">
                              ¥{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            asChild
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              立即购买
                            </a>
                          </Button>
                          <Button variant="outline" size="icon" className="border-purple-600 text-purple-300">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Other category tabs would filter products accordingly */}
        {categories.slice(1).map((category) => (
          <TabsContent key={category.value} value={category.value} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter(product => product.category === category.value)
                .map((product) => {
                  const CategoryIcon = getCategoryIcon(product.category);
                  const discountPercent = getDiscountPercentage(product.price, product.originalPrice);
                  
                  return (
                    <Card key={product.id} className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm hover:border-purple-500 transition-all group">
                      {/* Same product card structure as above */}
                      <div className="relative">
                        <div className="aspect-square bg-slate-700/30 rounded-t-lg relative overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center">
                            <CategoryIcon className="h-24 w-24 text-purple-400" />
                          </div>
                          
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isFeatured && (
                              <Badge className="bg-yellow-600">
                                <Star className="h-3 w-3 mr-1" />
                                推荐
                              </Badge>
                            )}
                            {discountPercent > 0 && (
                              <Badge variant="destructive">
                                -{discountPercent}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-purple-300">{product.category}</p>
                            </div>

                            <p className="text-sm text-purple-200 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>

                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-white">
                                ¥{product.price.toFixed(2)}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-sm text-purple-400 line-through">
                                  ¥{product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button 
                                asChild
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                              >
                                <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  立即购买
                                </a>
                              </Button>
                              <Button variant="outline" size="icon" className="border-purple-600 text-purple-300">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Service Promise */}
      <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-white text-center mb-6">服务保障</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="text-white font-medium mb-1">正品保证</h4>
              <p className="text-purple-300 text-sm">所有商品均为正品，假一赔十</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="text-white font-medium mb-1">7天退换</h4>
              <p className="text-purple-300 text-sm">不满意可申请7天无理由退换</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="text-white font-medium mb-1">开光加持</h4>
              <p className="text-purple-300 text-sm">部分商品提供开光加持服务</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-yellow-400" />
              </div>
              <h4 className="text-white font-medium mb-1">贴心服务</h4>
              <p className="text-purple-300 text-sm">专业客服团队，贴心售后服务</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}